import { Star } from "lucide-react";
import { useState } from "react";
import { useCreateReview, type OrderLine } from "@/shared/api";
import { REVIEW_TEXT } from "@/shared/config/constants";
import { useToast } from "@/shared/slices";
import { Button, Modal, TextField } from "@/shared/ui/reusablecomponent";
import styles from "@/pages/page.module.scss";

const STARS = [1, 2, 3, 4, 5];
const MAX_REVIEW_LENGTH = 1000;

interface ReviewModalProps {
  orderId: number;
  line: OrderLine;
  productName: string;
  onClose: () => void;
}

export function ReviewModal({ orderId, line, productName, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const createReview = useCreateReview();
  const toast = useToast();

  const submit = () =>
    createReview.mutate(
      { body: { orderId, productId: line.productId, rating, reviewText: text.trim() } },
      {
        onSuccess: () => {
          toast.success(REVIEW_TEXT.saved);
          onClose();
        },
        onError: () => toast.error(REVIEW_TEXT.failed),
      },
    );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={REVIEW_TEXT.title(productName)}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{REVIEW_TEXT.cancel}</Button>
          <Button loading={createReview.isPending} disabled={!text.trim()} onClick={submit}>{REVIEW_TEXT.submit}</Button>
        </>
      }
    >
      <div className={styles.ratingPicker} role="group" aria-label={REVIEW_TEXT.rating}>
        {STARS.map((n) => (
          <button key={n} type="button" aria-label={REVIEW_TEXT.star(n)} aria-pressed={n === rating} onClick={() => setRating(n)}>
            <Star size={22} fill={n <= rating ? "currentColor" : "none"} aria-hidden />
          </button>
        ))}
      </div>
      <TextField isTextbox rows={4} label={REVIEW_TEXT.body} placeholder={REVIEW_TEXT.placeholder}
        value={text} onChange={setText} maxLength={MAX_REVIEW_LENGTH} required />
    </Modal>
  );
}
