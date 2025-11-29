// /src/components/elements/marketplace/RequestQuoteModal.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { requestQuote } from "../../../apis/purchasesApi";
import { ButtonPrimary, ButtonSecondary } from "../../shared/button/Button";
import { Input } from "../../shared/input/Input";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 20px 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  margin: 0 0 16px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const FieldGroup = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
  resize: vertical;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const HelperText = styled.p`
  margin: 4px 0 0;
  font-size: 0.8rem;
  opacity: 0.75;
`;

export function RequestQuoteModal({ open, onClose, credit }) {
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!open) return null;

  const parsedQuantity = Number((quantity || "").replace(/,/g, ""));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!parsedQuantity || parsedQuantity <= 0) {
      setErrorMessage("Enter a valid quantity greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      await requestQuote({
        creditId: credit.id,
        requestedQuantity: parsedQuantity,
        buyerNote: note || undefined,
      });

      setSuccessMessage(
        "Your quote request has been submitted. A marketplace administrator or seller will follow up."
      );
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Something went wrong while submitting your request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setQuantity("");
    setNote("");
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  const stop = (e) => e.stopPropagation();

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={stop}>
        <form onSubmit={handleSubmit}>
          <Title>Request a quote</Title>
          <Subtitle>
            {credit.name} · {credit.location}
          </Subtitle>

          <FieldGroup>
            <Label htmlFor="quantity">
              Requested quantity ({credit.unit})
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Up to ${credit.quantityAvailable.toLocaleString()}`}
            />
            <HelperText>
              Available: {credit.quantityAvailable.toLocaleString()}{" "}
              {credit.unit}
            </HelperText>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="note">Notes (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share any timing, compliance, or project details related to this request."
            />
          </FieldGroup>

          {errorMessage && (
            <HelperText style={{ color: "#b91c1c" }}>
              {errorMessage}
            </HelperText>
          )}

          {successMessage && (
            <HelperText style={{ color: "#16a34a" }}>
              {successMessage}
            </HelperText>
          )}

          <Actions>
            <ButtonSecondary type="button" onClick={handleClose}>
              Cancel
            </ButtonSecondary>
            <ButtonPrimary type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit request"}
            </ButtonPrimary>
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
}
